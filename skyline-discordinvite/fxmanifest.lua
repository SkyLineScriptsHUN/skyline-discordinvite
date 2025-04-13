fx_version 'cerulean'
game 'gta5'

author 'SkyLine'
description 'Discord Invite Menü'
version '1.0.1'

client_scripts {
    'client.lua'
}

server_scripts {
    'server.lua'
}

shared_scripts {
    'config.lua',
    '@ox_lib/init.lua',
    '@es_extended/imports.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js',
    'html/img/*.*'
}

lua54 'yes'

dependencies {
    'ox_lib'
}