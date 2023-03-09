export class UserLogged {

    constructor(
        public email: string,
        public rol: string,
        public name: string,
        public lastname:string,
        public user_id: string,
        public document_number:string,
        public photo?: string
    ){}

}
export class User {

    constructor(
        public user_id: string,
        public document_type: string,
        public document_number: string,
        public email: string,
        public name: string,
        public lastname: string,
        public gender: string,
        public phone: string,
        public validationState: boolean,
        public email_provider: string,
        public rol: string,
        public photo?: string
    ){}

}