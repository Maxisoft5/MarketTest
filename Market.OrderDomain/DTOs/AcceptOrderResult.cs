namespace Market.OrdersDomain.DTOs
{
    public class AcceptOrderResult
    {
        public string OrderPart { get; set; }
        public int StatusCode { get; set; }
        public bool IsSuccess {  get; set; }
    }
}
