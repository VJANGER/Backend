const Ticket = require('./ticketModel');

async function createTicket(purchaseId, totalPrice) {
  try {
    const ticket = new Ticket({
      purchaseId,
      totalPrice,
    });
    const savedTicket = await ticket.save();
    return savedTicket;
  } catch (error) {
    throw new Error('No se pudo crear el ticket');
  }
}

module.exports = {
  createTicket,
};
