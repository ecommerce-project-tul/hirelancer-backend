interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string
    photo?: string;
    linkedInToken?: string;
    githubLink?: string;
    linkedInLink?: string;
    description?: string;
    reviews: any[]
    announcements: any[]
    offers: any[]
    userTechnologyStacks: any[]
  }
  
  export default IUser;