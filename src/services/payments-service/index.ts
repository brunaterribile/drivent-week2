import { notFoundError } from "@/errors";
import paymentsRepository from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Payment } from "@prisma/client";

async function getPayments(ticketId: number) {
    const result = await paymentsRepository.getPayments(ticketId)
    if(!result) throw notFoundError();
    return result;
}

export type PaymentData = Omit<Payment, 'id' | 'ticketId' |'createdAt' | 'updatedAt'>;

export type CardData = {
    issuer: string,
    number: number,
    name: string,
    expirationDate: Date,
    cvv: number
}

async function payTicket(ticketId: number, cardData: CardData, userId: number) {
    const ticket = await ticketsRepository.getTicket(ticketId)
    
    const paymentData = {
        value: ticket.TicketType.price,
        cardIssuer: cardData.issuer,
        cardLastDigits: cardData.number.toString().slice(-4)
    }
    
    const result = await paymentsRepository.payTicket(ticketId, paymentData)
    
    if(!result) throw notFoundError();
    return result;
}

const paymentsService = {
    getPayments,
    payTicket
}

export default paymentsService;