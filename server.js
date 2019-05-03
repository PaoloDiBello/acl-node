const express = require('express');
const acl = require('express-acl');
const app = express();


const AccessControl = require('role-acl');
const ac = new AccessControl();

var roles = [

    {
        role: 'admin',

        permissions:
        {
            projects: ['create', 'read', 'update', 'delete'],
            tasks: ['create', 'comment', 'update', 'delete'],
            milestone: ['create', 'update', 'delete']
        }

    },

    {
        role: 'user',

        permissions:
        {
            projects: ['read', 'update'],
            tasks: ['update'],
            milestone: ['create', 'update', 'delete']
        }
    }

];

//console.log('roles[0]', roles[0].permissions)

for (single_role of roles) {
    let { role, permissions } = single_role;

    for (resource of Object.keys(permissions)) {

        for (single_permission of permissions[resource]) {
            ac.grant(role)
                .execute(single_permission).on(resource);
        }

    }
}


const permission = ac.can('user').execute('read').on('projects');
console.log(permission.granted);    // —> true
//console.log(permission.attributes); // —> ['*'] (all attributes)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server Running On Port ${PORT}`));

// roles is the list of existing roles. userRoles is the set of roles the user has.

/*
    Whether a user needs multiple roles or not is app-specific.
    One of those details that makes a generic lib kinda pointless
    (or absurdly bloated to cover too many cases).
    An app might have dynamically generated roles, and maybe role
    inheritance doesn't make sense. So you just add roles to users
    as they need access. Being able to have multiple roles is one
    of the strengths of role-based AC.
*/


/*

Then you could check if a user has a role like this:
function isAllowed (userRoles, resource, action) {
  return userRoles.some(role => roles[role] && roles[role][resource].includes(action));
}

(Might also check that roles[role][resource] exists if you don't want it to throw for a bad resource name)
*/