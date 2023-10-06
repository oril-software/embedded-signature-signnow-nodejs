const axios = require('axios');

// Your SignNow API credentials
const username = YOUR_USERNAME_NAME;
const password = YOUR_PASSWORD;
const templateId = YOURE_TEMPLATE_ID;
const authToken = YOUR_AUTH_TOKEN

async function getAccessToken() {
    const response = await axios.post('https://api.signnow.com/oauth2/token', {
        grant_type: 'password',
        username: username,
        password: password,
    }, {
        headers: {
            Authorization: `Basic ${authToken}`,
            'Content-type': 'multipart/form-data;'
        }
    });

    return response.data.access_token;
}

async function createDocumentFromTemplate(accessToken, templateId, username) {
    const response = await axios.post(`https://api.signnow.com/template/${templateId}/copy`, {
        document_name: `Test Document for ${username}`  //Specify any name here. We used username in the name to see for what user this document was created 
    }, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
    });
    return response.data.id;
}

async function prefillDocumentFields(accessToken, documentId) {
    const response = await axios.put(`https://api.signnow.com/v2/documents/${documentId}/prefill-texts`, {
        fields: [
            {
                'field_name': 'DealerName',
                'prefilled_text': 'My Awesome Dealership'
            },
            {
                'field_name': 'LenderName',
                'prefilled_text': 'Johny Lender'
            }
        ]
    }, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
    });
}

async function getRolesFromDocumentById(accessToken, documentId) {
    const response = await axios.get(`https://api.signnow.com/document/${documentId}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
    return response.data.roles;
}

async function creaateEmbeddedSignInvite(accessToken, documentId, invites) {
    const response = await axios.post(`https://api.signnow.com/v2/documents/${documentId}/embedded-invites`, {
        invites: invites
    }, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data.data;
}

async function createEmbeddedSigningLink(accessToken, documentId, inviteId) {
    const response = await axios.post(`https://api.signnow.com/v2/documents/${documentId}/embedded-invites/${inviteId}/link/`, {
        "auth_method": "none",
        "link_expiration": 45   //45 minutes
    }, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data.data.link;
}

function buildInvitesForRoles(roles) {
    const invites = [];
    roles.forEach(role => {
        invites.push({
            email: `${role.name}@gmail.com`,
            role_id: role.unique_id,
            order: parseInt(role.signing_order),
            auth_method: 'none',
            redirect_uri: "https://example.com", //url where user will be redirected after signature is completed(optional)
        });
    });
    return invites;
}

// Main function to orchestrate the workflow
async function main() {
    try {
        // Obtain an access token
        const accessToken = await getAccessToken();

        //Create document from template
        const documentId = await createDocumentFromTemplate(accessToken, templateId, 'johndoe');

        //Prefill document text fields
        prefillDocumentFields(accessToken, documentId);

        //Get all roles that should sign the document
        const roles = await getRolesFromDocumentById(accessToken, documentId);

        //Create embedded sign invites (emails will not be sent to users) 
        const invites = buildInvitesForRoles(roles);
        const createdInvites = await creaateEmbeddedSignInvite(accessToken, documentId, invites);

        //Create signature links for each signer
        const signerOneLink = await createEmbeddedSigningLink(accessToken, documentId, createdInvites[0].id);
        const signerTwoLink = await createEmbeddedSigningLink(accessToken, documentId, createdInvites[1].id);

        console.log(signerOneLink);
        console.log(signerTwoLink);
    } catch (error) {
        console.log(error.message);
    }
}

// Run the workflow
main();
