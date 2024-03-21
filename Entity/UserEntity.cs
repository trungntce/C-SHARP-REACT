namespace WebApp;

using System;
using System.Collections.Generic;
using Framework;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;
using Unity.Interception.Utilities;

public class UserEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public string UserName { get; set; } = default!;
    [JsonIgnore]
    public string Password { get; set; } = default!;
    public string NationCode { get; set; } = default!;
    public string? Email { get; set; }
    public char UseYn { get; set; }
    public string? Remark { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }
    public DateTime? LoginDt { get; set; }
    public string? Token { get; set; }
    public string? UsergroupJson { get; set; }
    public List<string> UsergroupList
    {
        get
        {
            if (string.IsNullOrWhiteSpace(UsergroupJson))
                return new() { Setting.LoginUserGroup };

            var rtn = JsonConvert.DeserializeObject<List<string>>(UsergroupJson);
            if (rtn == null)
                rtn = new();

            rtn.Add(Setting.LoginUserGroup);

            return rtn;
        }
        set
        {
            if (value == null || value.Count <= 0)
                return;

            UsergroupJson = JsonConvert.SerializeObject(value);
        }
    }
    public Dictionary<string, int> MenuAuthDic { get; set; } = new();

    public override string ToString()
    {
        return $"{CorpId},{FacId},{UserId},{UserName},{NationCode}";
    }
}

public class UserList : List<UserEntity>
{
    public UserList(IEnumerable<UserEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
