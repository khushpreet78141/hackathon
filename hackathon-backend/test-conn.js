import axios from "axios";

const url = "https://lance-exhibitions-thru-antarctica.trycloudflare.com/v1/models";

async function test() {
    try {
        const res = await axios.get(url, { timeout: 5000 });
        console.log("Success:", res.data);
    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        }
    }
}

test();
