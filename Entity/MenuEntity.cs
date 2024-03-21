namespace WebApp;

using System;
using System.Collections.Generic;

using Newtonsoft.Json;
using ProtoBuf;
using Microsoft.Practices.EnterpriseLibrary.Data;

public enum PermMethod
{
    Read = 0
,   Create
,   Update
,   Delete
,   Admin
,   Etc1
,   Etc2
,   Etc3
,   Etc4
,   Etc5
,   Void
}

[ProtoContract]
public class MenuEntity : BaseEntity
{
    [ProtoMember(1)]
    public string CorpId { get; set; } = default!;
    [ProtoMember(2)]
    public string FacId { get; set; } = default!;
    [ProtoMember(3)]
    public string MenuId { get; set; } = default!;
    [ProtoMember(4)]
    public string MenuName { get; set; } = default!;
    [ProtoMember(5)]
    public char MenuType { get; set; }
    [ProtoMember(6)]
    public string MenuTypeName { get; set; } = default!;
    [ProtoMember(7)]
    public string? ParentId { get; set; }
    [ProtoMember(8)]
    public string? ParentName { get; set; }
    [ProtoMember(9)]
    public string? Icon { get; set; }
    [ProtoMember(10)]
    public char UseYn { get; set; }
    [ProtoMember(11)]
    public int MenuSort { get; set; }
    [ProtoMember(12)]
    public long Sort { get; set; }
    [ProtoMember(13)]
    public string? MenuBody { get; set; }
    [ProtoMember(14)]
    public int Depth { get; set; }
    [ProtoMember(15)]
    public string MenuPath { get; set; } = default!;
    [ProtoMember(16)]
    public string MenuPathName { get; set; } = default!;
    [ProtoMember(17)]
    public string Manager { get; set; }
    [ProtoMember(18)]
    public string MenuPathNameLang { get; set; } = default!;
    [JsonIgnore]
    public int? ChildCount { get; set; }
    [JsonIgnore]
    public string CreateUser { get; set; } = default!;
    [JsonIgnore]
    public DateTime CreateDt { get; set; }
    [JsonIgnore]
    public string? UpdateUser { get; set; }
    [JsonIgnore]
    public DateTime UpdateDt { get; set; }
    public char AnonymousYn { get; set; }

    public override string ToString()
    {
        return $"[{MenuId}:{MenuType}] {MenuName}";
    }
}

[ProtoContract]
public class MenuList : List<MenuEntity>
{
    public MenuList()
    {
    }

    public MenuList(IEnumerable<MenuEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
