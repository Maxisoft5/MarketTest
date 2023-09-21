import { ReceiverOrderCity } from "../enums/order-reciver-city";
import { SendOrderMethod } from "../enums/send-order-method";

export class SendDetils {
    orderId: string = '';
    FIO:string = '';
    receiverPhone:string = '';
    index:string = '';
    address:string = '';
    sendMethod!: SendOrderMethod;
    receiverOrderCity!:ReceiverOrderCity | undefined;
} 