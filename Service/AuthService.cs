namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Framework;
using k8s.KubeConfigModels;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public interface IAuthService
{
    UserEntity? Authenticate(string userId, string password);
}

public class AuthService : BaseService, IAuthService
{
    readonly string _authKey;

    public AuthService(IOptions<Setting> app)
    {
        _authKey = app.Value.AuthKey;
    }

    public UserEntity? Authenticate(string userId, string password)
    {
        var user = UserService.LoginSelect(userId, password);

        if (user == null)
            return null;

        if (user.UseYn != 'Y')
            return null;

        var menuAuthDic = UserService.MenuAuthDic(userId, user.UsergroupJson);

        string token = CreateToken(user, menuAuthDic);

        user.Token = token;
        user.MenuAuthDic = menuAuthDic;

        return user;
    }

    private string CreateToken(UserEntity user, Dictionary<string, int> menuAuthDic)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var identity = new ClaimsIdentity(new List<Claim>()
        {
            new Claim("CorpId", user.CorpId),
            new Claim("FacId", user.FacId),
            new Claim("UserId", user.UserId),
            new Claim("IsAdmin", user.UsergroupList.Contains(Setting.IsAdminGroup) ? "Y" : "N"),
            new Claim("MenuAuth", JsonConvert.SerializeObject(menuAuthDic)),
            new Claim("NationCode", user.NationCode),
        });

        var descriptor = new SecurityTokenDescriptor()
        {
            Subject = identity,
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_authKey)),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(descriptor);

        return tokenHandler.WriteToken(token);
    }
}
