local display = false
local nameRefreshTimer

RegisterCommand(Config.Command, function()
    SetDisplay(not display)
end, false)

function SetDisplay(bool)
    display = bool
    SetNuiFocus(bool, bool)
    SendNUIMessage({
        type = "ui",
        status = bool,
    })
    
    if bool then
        SendNUIMessage({
            type = "config",
            config = {
                useImages = Config.useImages,
                images = Config.images
            }
        })
        
        TriggerNameUpdate()
        nameRefreshTimer = SetInterval(function()
            TriggerNameUpdate()
        end, Config.NameRefresh * 1000)
    else
        if nameRefreshTimer then
            ClearInterval(nameRefreshTimer)
            nameRefreshTimer = nil
        end
    end
end

function TriggerNameUpdate()
    SendNUIMessage({
        type = "updateName",
    })
end

RegisterNUICallback("exit", function(data)
    SetDisplay(false)
end)

local function ShowNotification(title, description, type)
    if Config.Notify == 'ox' then
        lib.notify({
            title = title,
            description = description,
            type = type
        })
    elseif Config.Notify == 'esx' then
        ESX.ShowNotification(description)
    end
end

RegisterNUICallback("copyRP", function(data, cb)
    lib.setClipboard(Config.RPDiscord)
    cb('ok')
    Wait(100)
    ShowNotification(Config.NotifyTitle, Config.RPdesc, Config.NotifyType)
end)

RegisterNUICallback("copyMilitary", function(data, cb)
    lib.setClipboard(Config.MilitaryDiscord)
    cb('ok')
    Wait(100)
    ShowNotification(Config.NotifyTitle, Config.Militarydesc, Config.NotifyType)
end)

RegisterNUICallback("copyUB", function(data, cb)
    lib.setClipboard(Config.UBDiscord)
    cb('ok')
    Wait(100)
    ShowNotification(Config.NotifyTitle, Config.UBdesc, Config.NotifyType)
end)

RegisterNUICallback("getPlayerName", function(data, cb)
    local playerName = ESX.PlayerData.name
    cb(playerName)
end)

function SetInterval(fn, delay)
    local timer = true
    Citizen.CreateThread(function()
        while timer do
            fn()
            Citizen.Wait(delay)
        end
    end)
    return timer
end

function ClearInterval(timer)
    timer = false
end

RegisterNUICallback('ready', function(data, cb)
    SendNUIMessage({
        type = "config",
        config = {
            useImages = Config.useImages,
            images = Config.images
        }
    })
    cb('ok')
end)

RegisterNetEvent('updateUIConfig')
AddEventHandler('updateUIConfig', function(config)
    SendNUIMessage({
        type = "config",
        config = config
    })
end)