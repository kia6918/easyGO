import { BASE_URL } from "@/utils/config";
import axios from "axios";

const instance = axios.create({
    baseURL: BASE_URL + '/categories',
    timeout: 5000
})

class CategoriesService {
    static getCategories() {
        return new Promise((resolve, reject) => {
            try {
                instance.get('/').then(res => {
                    const data = res.data
                    resolve(
                        data.map(categories => ({
                            ...categories
                        }))
                    )
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    static getBusiness() {
        return instance.get('/business')
    }
}

export default CategoriesService;