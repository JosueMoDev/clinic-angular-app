export class Patient {

    constructor(
        public email: string,
        public name: string,
        public lastname:string,
        public patient_id: string,
        public document_number: string,
        public register_by: string,
        public photo?: string
    ){}

}