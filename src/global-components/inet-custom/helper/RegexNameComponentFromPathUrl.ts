
class regexNameComponentFromPathUrl {
    urlPathName: string = '';
    directoryPath: string = '';
    constructor(urlpath: string) {
        this.urlPathName = urlpath;
    }
    formatName() {
        const regexPath = /\//g;
        const replacePath = this.urlPathName.replace(regexPath, '-');
        const converPathToComponent = replacePath.split('-');
        let pathGr = [] as any;
        for(let i=0; i < converPathToComponent.length; i++) {
            if(converPathToComponent[i]) {
                pathGr.push(converPathToComponent[i].charAt(0).toUpperCase() + converPathToComponent[i].slice(1));
            }
        }
        if(pathGr.length == 0) return console.warn(pathGr + ' is error!');
        const name = pathGr.join('');
        return name;
    }
}

export { regexNameComponentFromPathUrl }