namespace WebApp;

using System;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class PanelInterlockIssueEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public int PanelInterlockId { get; set; }

    public string? IssueRemark { get; set; } = default!;
    public string? IssueAttach { get; set; } = default!;
    public string IssueUser { get; set; } = default!;
    public DateTime IssueDt { get; set; }

    public string? Json { get; set; }
    public string CreateUser { get; set; } = default!;
    public string? UpdateUser { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{PanelInterlockId}";
    }
}