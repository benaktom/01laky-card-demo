import Axios, {
    AxiosResponse,
    AxiosRequestConfig,
    AxiosError,
} from "axios";
import dotenv from 'dotenv';

dotenv.config();

class Proxy {
    private API_URI: string;

    constructor() {
        // [CR] co když není definovaná proměnná prostředí?
        this.API_URI = process.env.APIARY_URI as string;
    }

    private getProxyConfig(): AxiosRequestConfig {
        const proxyRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        };

        return proxyRequestConfig;
    }

    public async get<T>(
        path: string,
        cardNumber: string,
    ): Promise<T> {
        const proxyRequestConfig: AxiosRequestConfig = this.getProxyConfig();

        // [CR] nebylo by lepší použít async/await?
        // [CR] co když se nepovede získat data?
		return Axios.get<T>(`${this.API_URI}/${cardNumber}/${path}`, proxyRequestConfig)
			.then((response: AxiosResponse<T>) => {
				return response.data;
			}
			).catch((error: AxiosError) => {
            
				throw error;
			});
    }
}

export default Proxy;