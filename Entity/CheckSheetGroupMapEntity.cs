namespace WebApp;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class CheckSheetGroupMapEntity : BaseEntity
{
    public string EqpId { get; set; } = default!;
    public string OperCode { get; set; } = default!;
    public int CksGrpId { get; set; } = default!;
    public char? UseYn { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }

    public override string ToString()
    {
        return $"{EqpId},{OperCode},{CksGrpId}, {UseYn}, {CksGrpId}";
    }
}

