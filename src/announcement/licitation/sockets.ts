import offerRepository from "../offer/OfferRepository";
import { Offer } from "../../entity/Offer";
import { User } from "../../entity/User";
import UserNotFoundException from "../../exception/UserNotFoundException";
import * as jwt from 'jsonwebtoken'
import { Server, Socket } from "socket.io";
import userRepository from "../../user/UserRepository";
import { Announcement } from "../../entity/Announcement";
import announcementRepository from "../../announcement/AnnnouncementRepository";
import AnnouncementNotFoundException from "../../announcement/AnnouncementNotFoundException";
import OfferAlreadyPlacedException from "../../exception/OfferAlreadyPlacedException";
import HttpException from "../../exception/HttpException";

interface OfferRequest {
    token: string;
    announcementId: string;
    price: number;
};

export class ServerSocket {

    private io: Server;

    constructor(private dawidgora: any) {
        this.io = new Server(this.dawidgora, {cors: {origin: "*", methods: ["GET", "POST"]}});
        this.handleConnection();
    }

    public handleConnection(): void {
        this.io.on('connection', async (socket) => {
            console.log("Connected ...");
            try {
                const announcementId = socket.handshake.query.announcementId as string;
                const token = socket.handshake.query.token as string;

                const { userId } = jwt.decode(token, {}) as jwt.JwtPayload;
                const isMyAnnouncement = await this.isMyAnnouncement(userId, announcementId);
                const isAnnouncementActive = await this.isActive(announcementId);

                socket.emit("offers", await this.getOffers(announcementId));
                socket.emit("owner",  {isOwner: isMyAnnouncement})
                socket.emit("active",  {isActive: isAnnouncementActive})
                console.log("Room", announcementId);
                socket.join(announcementId);
                this.handleOffer(socket);
                if (isMyAnnouncement) {
                    this.acceptOffer(socket, announcementId)                 
                } 
           } catch(error) {
            socket.emit("error", error);
        }
        });
    }

    private async isActive(announcementId: string) {
        const announcement: Announcement | null = await announcementRepository.findOne({
            where: {
                id: announcementId,
            }
        });
        return announcement !== null ? announcement.isActive : false
    }

    private async getOffers(announcementId: string) {

        const foundAnnouncement: Announcement = await announcementRepository.findOne({
            where: {
                id: announcementId,
            },
            relations: [
                "offers",
                "offers.freelancer",
                "offers.announcement",
                "offers.xd"
            ]
        });
        if (foundAnnouncement == null) {
            throw new AnnouncementNotFoundException(announcementId);
        }
        return foundAnnouncement.offers.reverse() || [];
    }

    public handleOffer(socket: Socket) {
        socket.on("addOffer", async (offer: OfferRequest) => {
            try {
                const newOffer: Offer = await this.addNewOffer(offer);
                this.io.to(offer.announcementId).emit("offer", newOffer);
            } catch (error) {
                socket.emit("error", error);
            }
        })
    }
    
    private hasUserAddedPreviouslyOfferWithThisPrice(announcement: Announcement, user: User, price: number) {
        return new Promise(resolve => {
        offerRepository.findOne({
            where: {
                // @ts-ignore
                announcement: announcement, 
                // @ts-ignore
                freelancer: user,
                price: price
            }
        }).then(offer =>  resolve(Boolean(offer))).catch(console.error);
       })
    }

    private async addNewOffer(offerRequest: OfferRequest) {

        const { userId } = jwt.decode(offerRequest.token, {}) as jwt.JwtPayload;

        const user: User | null = await userRepository.findOne({
            where: {
                id: userId,
            }
        })

        if (user == null) {
            throw new UserNotFoundException(userId);
        }

        const announcement: Announcement | null = await announcementRepository.findOne({
            where: {
                id: offerRequest.announcementId
            }
        });
        
        if (announcement == null) {
            throw new AnnouncementNotFoundException(offerRequest.announcementId);
        }
        
        if (await this.hasUserAddedPreviouslyOfferWithThisPrice(announcement, user, offerRequest.price)) {
            throw new OfferAlreadyPlacedException(offerRequest.price);
        }

        const offer: Offer = offerRepository.create({
            freelancer: user,
            announcement: announcement,
            price: offerRequest.price || announcement.startingPrice
        });
        
        await offerRepository.save(offer);

        return offer;
    } 


    public async isMyAnnouncement(userId: string, announcementId: string ) {
        const user: User | null = await userRepository.findOne({
            where: {
                id: userId,
            }
        })

        const announcement: Announcement | null = await announcementRepository.findOne({
            where: {
                id: announcementId,
                // @ts-ignore
                client: user
            }
        });
        
       return announcement !== null
    }

    public acceptOffer(socket: Socket, announcementId: string) {
        socket.on("acceptOffer", async ({ offerId }) => {
        const announcement: Announcement | null = await announcementRepository.findOne({
            where: {
                id: announcementId,
            }
        });

        if (announcement == null) {
            throw new AnnouncementNotFoundException(announcementId);
        }

        const offer: Offer | null = await offerRepository.findOne({
                where: {
                    id: offerId
                }
            });
            
        if(offer == null) {
            throw new HttpException(400, "offer not found");
        }

        announcement.chosenOffer = offer;
        offer.xd = announcement;
        announcement.isActive = false;
        await announcementRepository.save(announcement);
        await offerRepository.save(offer);
        this.io.to(announcementId).emit("active", {isActive: false});

        return true;
    });        
    }
}


