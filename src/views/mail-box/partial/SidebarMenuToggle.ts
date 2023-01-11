class sidebarMenuToggle {
    storageVl: any = null;
    clsMenu: string = 'menu-minus';
    mbMenu: string = 'mailboxMenu';
    mbId: any = document.getElementById('mail-box-toggle') as HTMLElement;
    constructor() {
        if(this.getLocalStorage()) {
            this.addClassToMbId();
        }
    }
    toggleMenu() {
        if(this.mbId.classList.contains(this.clsMenu)) {
            this.removeClassToMbId();
        } else {
            this.addClassToMbId();
        }
    }
    removeClassToMbId() {
        this.mbId.classList.remove(this.clsMenu);
        this.localStorage(false);
    }
    addClassToMbId() {
        this.mbId.classList.add(this.clsMenu);
        this.localStorage(true);
    }
    localStorage(vl) {
        localStorage.setItem(this.mbMenu, vl);
    }
    getLocalStorage() {
        const mn = localStorage.getItem("mailboxMenu");
        return mn == 'true' ? true : mn == 'false' ? false : ''
    }
}
export {
    sidebarMenuToggle
}