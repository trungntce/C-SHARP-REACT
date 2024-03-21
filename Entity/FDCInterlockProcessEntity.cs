namespace WebApp;

using System;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class FDCInterlockProcessEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public int InterlockRowNo { get; set; }

    public char handleCode { get; set; }
    public string? HandleRemark { get; set; } = default!;
    public string? HandleAttach { get; set; } = default!;
    public string HandleUser { get; set; } = default!;
    public DateTime HandleDt { get; set; }

    public string? SettleRemark { get; set; } = default!;
    public string? SettleAttach { get; set; } = default!;
    public string? SettleUser { get; set; }
    public DateTime? SettleDt { get; set; }

    public int? ReferenceId { get; set; }
    public string? ReferenceCode { get; set; }

    public char? SettleYn { get; set; }
    public char? UpdateYn { get; set; }
    public string? Json { get; set; }
    public string CreateUser { get; set; } = default!;
    public string? UpdateUser { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{InterlockRowNo},{HandleRemark}";
    }
}