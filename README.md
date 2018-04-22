# Legible Accounting

Legible Accounting is a web-based software product that enables businesses to
manage their chart of accounts and associated transactions. Businesses can also
view generated business statements.

## Deployment Requirements

* [CentOS 7.4](https://centos.org/)
  - [Extra Packages for Enterprise Linux (EPEL)](https://fedoraproject.org/wiki/EPEL)
  - [CertBot](https://certbot.eff.org/)
  - [Ansible 2.5.x](https://ansible.com/)

Software versions other than the ones specified may work, but it is not
recommended to deviate from these requirements. Where a flexible version range
is provided (e.g. 1.0.x), consider using the lowest software version in said
range (e.g. 1.0.0) if you encounter issues with a newer software version.

## Setting up the Deployment

* Ensure that all of the deployment requirements are installed and
  operational. Consult the documentation provided by the publishers of these
  software for details on how to install and verify proper operation.
* Ensure that SELinux is configured to be in `permissive` mode.
* Get an SSL certificate: `certbot --apache certonly`
* Create a non-root user named `vagrant` and set the password to personal
  preference.
* Add the `vagrant` user to the `wheel` group so they can use privilege
  escalation.
* Create a folder at the filesystem root named `vagrant` and allow full
  read-write-execute to all users.
* Add `127.0.0.1` to `/etc/ansible/hosts` (create the file if it doesn't exist).
* Copy the directory containing this file over to the `/vagrant` directory.
* (If deploying to a new domain) A few codemods are necessary:
  - Change the VirtualHost `ServerName` to reference your domain.
  - Change the VirtualHost SSL configuration to reference your domain.
  - Change the `ALLOWED_HOSTS` in the Django configuration to reference your
    domain.
* Run this command to finish setting up the deployment:
  `ansible-playbook --connection=local --user=vagrant --ask-become-pass /vagrant/server/provision/configure.yml`
* Open a web browser and load your domain to confirm the software is
  operational.
* NOTE: It is suggested to change the superuser password and remove the other default user accounts.

Default user credentials are as follows:

* Superuser
  - Username: `superuser`
  - Password: `superuser`
* Administrator
  - Username: `administrator1`
  - Password: `administrator`
* Manager
  - Username: `manager1`
  - Password: `manager`
* Accountant
  - Username: `accountant1`
  - Password: `accountant`

## Maintaining the Deployment

* The `dev` branch contains instructions for running a local instance of the
  application. To deploy changes to the `dev` branch, merge the latest code
  onto the production server and perform the deployment steps relevant to the
  changed code e.g. for client code, running the build process, or for server code,
  reloading the server / performing a database migration / etc. Consult the Ansible
  provision scripts in `server/provision` for guidance.
