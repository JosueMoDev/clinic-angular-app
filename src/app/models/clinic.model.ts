export class Clinic {

    constructor(
        public clinic_id:string,
        public register_number: string,
        public name: string,
        public province: string,
        public city: string,
        public register_by: string,
        public photo?: string
    ){}

}