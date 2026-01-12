const APP_NAME = process.env.SIGNER_APP_NAME;
const SECRET_KEY = process.env.SIGNER_SECRET_KEY;
const AUTH_URL = process.env.SIGNER_AUTH_URL;
const SIGN_URL = process.env.SIGNER_SIGN_URL;
const DOWNLOAD_URL = process.env.SIGNER_DOWNLOAD_URL;

const axios = require("axios");

let AUTH_TOKEN = null;
let TOKEN_EXPIRY = null;


async function generateAuthToken() {
    const res = await axios.post(AUTH_URL, {
        AppName: APP_NAME,
        SecretKey: SECRET_KEY,
    });

    if (!res.data?.Response?.AuthToken) {
        throw new Error("Failed to generate Auth Token");
    }

    AUTH_TOKEN = res.data.Response.AuthToken;
    TOKEN_EXPIRY = Date.now() + 55 * 60 * 1000; // ~55 min

    return AUTH_TOKEN;
}

async function getAuthToken() {
    if (!AUTH_TOKEN || Date.now() > TOKEN_EXPIRY) {
        return await generateAuthToken();
    }
    return AUTH_TOKEN;
}


async function pdfUrlToBase64(pdfUrl) {
    const res = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
    });

    return Buffer.from(res.data).toString("base64");
}


function getPositionCoordinates(position) {
    switch (position) {
        case "bottom-left":
            return { Left: 100, Top: 520 };
        case "bottom-right":
            return { Left: 600, Top: 520 };
        case "top-left":
            return { Left: 100, Top: 100 };
        case "top-right":
            return { Left: 600, Top: 100 };
        default:
            return { Left: 300, Top: 520 };
    }
}


async function buildSigningPayload(meeting) {
    const advocateEmail = meeting.advocateId.email;

    // 🔹 SEQUENCE MAINTAINED
    const signatoryEmails = [];
    const signatureSettings = [];
    const controlDetails = [];

    meeting.signatories.forEach((signer, index) => {
        signatoryEmails.push(signer.email);

        signatureSettings.push({
            ModeOfSignature: "3",
            Name: signer.name,
            ...(signer.DOB ? { DOB: signer.DOB } : {}),
            ...(signer.Gender ? { Gender: signer.Gender } : {}),
            MobileNo: signer.MobileNo,
            CountryCode: signer.CountryCode,
            Automatedsigningenabled: false,
        });


        const pos = getPositionCoordinates(signer.signPosition);

        controlDetails.push({
            PageNo: String(signer.PageNo || 1),
            ControlID: 4,
            AssignedTo: index + 1, // 🔥 SAME ORDER
            Left: pos.Left,
            Top: pos.Top,
            Height: 50,
            Width: 200,
        });
    });

    const base64PDF = await pdfUrlToBase64(meeting.documentUrl.pdf);

    return {
        EmailId: advocateEmail,
        DonotSendCompletionMailToParticipants: false,
        DoNotNotifyCustomer: false,
        WorkflowType: "1",
        RedirectURL: "http://localhost:3000/thank-you",
        EnvelopeExpiry: 1,
        SignatoryEmailIds: signatoryEmails,
        SignatureSettings: signatureSettings,
        lstDocumentDetails: [
            {
                DocumentName: "document.pdf",
                FileData: base64PDF,
                ControlDetails: controlDetails,
            },
        ],
    };
}



async function initiateDocumentSigning(meeting) {
    const payload = await buildSigningPayload(meeting);

    let token = await getAuthToken();

    try {
        const res = await axios.post(SIGN_URL, payload, {
            headers: {
                Authorization: `basic ${token}`,
                "Content-Type": "application/json",
            },
        });

        return res.data;
    } catch (err) {
        if (
            err.response?.data?.Message?.includes("Token Expired")
        ) {
            token = await generateAuthToken();

            const retry = await axios.post(SIGN_URL, payload, {
                headers: {
                    Authorization: `basic ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return retry.data;
        }

        throw err;
    }
}

async function downloadSignedDocument(workflowId) {
     console.log("DOWNLOAD_URL =>", DOWNLOAD_URL);
    console.log("workflowId =>", workflowId);
    if (!workflowId) {
        throw new Error("WorkflowId is required");
    }

    let token = await getAuthToken();

    const payload = {
        WorkflowId: workflowId,
    };

    try {
        const res = await axios.post(DOWNLOAD_URL, payload, {
            headers: {
                Authorization: `basic ${token}`,
                "Content-Type": "application/json",
            },
        });

        return res.data;
    } catch (err) {
        // 🔁 TOKEN EXPIRED → regenerate & retry
        if (
            err.response?.data?.Message &&
            err.response.data.Message.includes("Token Expired")
        ) {
            token = await generateAuthToken();

            const retry = await axios.post(DOWNLOAD_URL, payload, {
                headers: {
                    Authorization: `basic ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if(retry.data.IsSuccess === false) {
                throw new Error(retry.data.Message || "Failed to download signed document");
            }

            return retry.data;
        }

        throw err;
    }
}


module.exports = {
    initiateDocumentSigning,
    downloadSignedDocument
};
