document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

let config = {
    useImages: false,
    images: {
        rp: 'rp.png',
        military: 'mil.png',
        ub: 'ub.png'
    }
};

window.addEventListener("message", (event) => {
    if (event.data.type === "config") {
        config = event.data.config;
        updateIcons();
    } else if (event.data.type === "ui") {
        const container = document.getElementById("container");
        if (event.data.status) {
            container.style.display = "flex";
            document.querySelectorAll('.server-card').forEach((card, index) => {
                card.style.animation = `fadeInUp 0.4s ease-out ${index * 0.1}s forwards`;
            });
            updatePlayerName();
        } else {
            document.querySelectorAll('.server-card').forEach((card, index) => {
                card.style.animation = `fadeOut 0.3s ease-out ${index * 0.05}s forwards`;
            });
            setTimeout(() => {
                container.style.display = "none";
            }, 300);
        }
    } else if (event.data.type === "updateName") {
        updatePlayerName();
    }
});

function updateIcons() {
    const serverIcons = {
        rp: document.querySelector('[data-action="rp"] .server-icon'),
        military: document.querySelector('[data-action="military"] .server-icon'),
        ub: document.querySelector('[data-action="ub"] .server-icon')
    };

    if (config.useImages) {
        Object.entries(serverIcons).forEach(([action, icon]) => {
            const textElement = icon.querySelector('.icon-text');
            const imgElement = icon.querySelector('.icon-image');
            
            imgElement.src = `./img/${config.images[action]}`;
            
            textElement.style.display = 'none';
            imgElement.style.display = 'block';
            icon.style.backgroundColor = 'transparent';
            
            imgElement.onerror = function() {
                console.error(`Fasz: ./img/${config.images[action]}`);
                textElement.style.display = 'flex';
                imgElement.style.display = 'none';
                setBackgroundColor(action, icon);
            };
        });
    } else {
        Object.entries(serverIcons).forEach(([action, icon]) => {
            const textElement = icon.querySelector('.icon-text');
            const imgElement = icon.querySelector('.icon-image');
            
            textElement.style.display = 'flex';
            imgElement.style.display = 'none';
            setBackgroundColor(action, icon);
        });
    }
}

function setBackgroundColor(action, icon) {
    switch(action) {
        case 'rp':
            icon.style.backgroundColor = '#5865F2';
            break;
        case 'military':
            icon.style.backgroundColor = '#ED4245';
            break;
        case 'ub':
            icon.style.backgroundColor = '#57F287';
            break;
    }
}

function updatePlayerName() {
    $.post(`https://${GetParentResourceName()}/getPlayerName`, JSON.stringify({}), function(playerName) {
        $("#player-name").text(playerName);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    $.post(`https://${GetParentResourceName()}/ready`, JSON.stringify({}));
    
    updateIcons();

    document.onkeyup = function(data) {
        if (data.which == 27) {
            $.post(`https://${GetParentResourceName()}/exit`, JSON.stringify({}));
        }
    };
    
    $(".server-card").on("click", function() {
        const action = $(this).data("action");
        
        $(this).addClass("clicked");
        setTimeout(() => {
            $(this).removeClass("clicked");
        }, 200);
        
        switch(action) {
            case 'rp':
                $.post(`https://${GetParentResourceName()}/copyRP`, JSON.stringify({}));
                break;
            case 'military':
                $.post(`https://${GetParentResourceName()}/copyMilitary`, JSON.stringify({}));
                break;
            case 'ub':
                $.post(`https://${GetParentResourceName()}/copyUB`, JSON.stringify({}));
                break;
        }
    });
});