export class Config {
    
    private constructor(){}

    static get ApiUser(){
       return process.env.COD_API_USER || 'username';
    }

    static get ApiPassword(){
        return process.env.COD_API_PASSWORD || 'password';
     }
}