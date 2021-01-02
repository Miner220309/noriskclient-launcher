interface ISession {
    username: string;
    token: string;
    uuid: string;
}

export class Session {
    public username: string | undefined;
    public token: string | undefined;
    public uuid: string | undefined;

    constructor(params: Session = {} as Session) {
        let {
            username = "",
            token = "",
            uuid = "",
        } = params;

        this.token = token;
        this.username = username;
        this.uuid = uuid;
    }
}