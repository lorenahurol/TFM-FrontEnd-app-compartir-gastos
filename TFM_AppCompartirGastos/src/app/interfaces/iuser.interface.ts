export interface IUser {
    id: number;
    mail: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    countryCode?: string;
    phone?: string;
    image?: string;
    active?: boolean
}
