export class Appointment {

    constructor(
        public appointment_id:string,
        public start: Date,
        public end: Date,
        public title: string,
        public clinic: string,
        public doctor: string,
        public patient: string,
        public createdby: string
    ){}

}