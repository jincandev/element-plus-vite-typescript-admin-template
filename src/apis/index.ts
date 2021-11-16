import { Get, Post } from '@/utils/decorators/http'

class ABC {

    @Get("/")
    doGet(params?: any) {
        return {
            kk: "BIN",
            __params: {
                id: 123
            },
            __query: {
                name: "Nardy"
            }
        }
    }

    @Post("/save-msg")
    doPost(data?: any) {
        return {
            __params: {
                id: 123
            },
            __query: {
                name: "Nardy"
            }
        }
    }

}

const abc = new ABC()

// abc.doGet()

// abc.doPost({name: "abc"})

export default abc