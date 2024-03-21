namespace WebApp;

using System;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class PanelInterlockProcessEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public int PanelInterlockId { get; set; }
    public int Step { get; set; }

    public string? RollId { get; set; }
    public string? PanelId { get; set; }

    public char JudgeCode { get; set; } = default!;
    public string? JudgeMethod { get; set; } = default!;
    public string? JudgeRemark { get; set; } = default!;
    public string? JudgeAttach { get; set; } = default!;
    public string JudgeUser { get; set; } = default!;
    public DateTime JudgeDt { get; set; }

    public char? SettleCode { get; set; } = default!;
    public string? SettleRemark { get; set; } = default!;
    public string? SettleAttach { get; set; } = default!;
    public string? SettleUser { get; set; }
    public DateTime? SettleDt { get; set; }

    public int? ReferenceId { get; set; }
    public string? ReferenceCode { get; set; }

    public char? SettleYn { get; set; }
    public string? Json { get; set; }
    public string? PanelJson { get; set; }
    public string CreateUser { get; set; } = default!;
    public string? UpdateUser { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{PanelInterlockId},{Step},{JudgeCode}";
    }
}