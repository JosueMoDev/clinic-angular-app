export class User {

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