// homeButtonsHandler.js

// this javascript file needs to get session id and compare with permissions to know what links to to make available.
// There needs to be another check when accessing the page in the nodeBackbone.js to ensure users don't manually navigate to the page, 
// but the check in this file is for UX so they know what they can and can't do.

// dom edits will make live links inside buttons
    // see home5.handlebars for example of button turned live link

function farmerLinker() {
    // get the button element in the handlebars file by the id I put on it
    let thisButton = document.getElementById('farmerButton');

    // create a new link element *after* it (not *append* below it as a child)
    thisButton.after(document.createElement('a'));

    // use *let* to get pointer to the new link element we created, which is now the *nextSibling* of the original button element
    let newLink = thisButton.nextSibling;

    // set the properties of the new link element, copying where possible
    newLink.innerText = 'Farmer';
    newLink.href = '/farmer';
    newLink.setAttribute('role', 'button');
    newLink.setAttribute('class', thisButton.getAttribute('class'));
    newLink.setAttribute('style', thisButton.getAttribute('style'));

    // remove the button element, leaving only the link element in its place :)
    thisButton.remove();
}

function boxPackerLinker() {
    let thisButton = document.getElementById('boxPackerButton');
    thisButton.after(document.createElement('a'));
    let newLink = thisButton.nextSibling;
    newLink.innerText = 'Box Packer';
    newLink.href = '/box-packer';
    newLink.setAttribute('role', 'button');
    newLink.setAttribute('class', thisButton.getAttribute('class'));
    newLink.setAttribute('style', thisButton.getAttribute('style'));
    thisButton.remove();
}

function csaSupporterLinker() {
    let thisButton = document.getElementById('csaSupportButton');
    thisButton.after(document.createElement('a'));
    let newLink = thisButton.nextSibling;
    newLink.innerText = 'CSA Supporter';
    newLink.href = '/csa-supporter';
    newLink.setAttribute('role', 'button');
    newLink.setAttribute('class', thisButton.getAttribute('class'));
    newLink.setAttribute('style', thisButton.getAttribute('style'));
    thisButton.remove();
}

function adminLinker() {
    let thisButton = document.getElementById('adminButton');
    thisButton.after(document.createElement('a'));
    let newLink = thisButton.nextSibling;
    newLink.innerText = 'Administrator';
    newLink.href = '/admin';
    newLink.setAttribute('role', 'button');
    newLink.setAttribute('class', thisButton.getAttribute('class'));
    newLink.setAttribute('style', thisButton.getAttribute('style'));
    thisButton.remove();
}


// first implementation will paste in all buttons, adding checks to permissions at a later stage (probably no login for draft version of Step 3)

farmerLinker();
boxPackerLinker();
csaSupporterLinker();
adminLinker();
