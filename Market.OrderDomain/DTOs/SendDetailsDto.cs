using Market.OrdersDomain.Enums;

namespace Market.OrdersDomain.DTOs
{
    public class SendDetailsDto
    {
        public Guid OrderId { get; set; }
        public SendOrderMethod SendMethod { get; set; }
        public ReceiverOrderCity ReceiverOrderCity { get; set; }
        public string? FIO { get; set; }
        public string? ReciverPhone { get; set; }
        public string? Index { get; set; }
        public string? Address { get; set; }
    }
}
