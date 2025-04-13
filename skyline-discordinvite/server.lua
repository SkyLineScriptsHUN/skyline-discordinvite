RegisterNetEvent('sendUIConfig')
AddEventHandler('sendUIConfig', function()
    local src = source
    TriggerClientEvent('updateUIConfig', src, Config)
end)