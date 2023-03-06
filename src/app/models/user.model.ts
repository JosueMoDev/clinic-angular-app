export class User {

    constructor(
        public email: string,
        public rol: string,
        public user_id: string,
        public document_number:string,
        public photo?: string
    ){}

}