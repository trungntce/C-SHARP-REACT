using Microsoft.AspNetCore.SignalR;

namespace WebApp;

public class MainHub : Hub
{
    public async Task SendMessageAll(string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", message);
    }

    public async Task SendMessageGroup(string group, string message)
    {
        await Clients.Group(group).SendAsync("ReceiveMessage", message);
    }

    public override async Task OnConnectedAsync()
    {
        var group = Context.GetHttpContext()?.Request.Query["group"];

        if(!string.IsNullOrWhiteSpace(group))
            await Groups.AddToGroupAsync(Context.ConnectionId, group!);

        await base.OnConnectedAsync();
    }
}