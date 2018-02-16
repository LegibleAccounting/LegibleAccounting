# Legible Accounting

Legible Accounting is a web-based software product that enables businesses to
manage their chart of accounts and associated transactions. Businesses can also
view generated business statements.

## Development Requirements

* [Git](https://git-scm.com/)
* [VirtualBox 5.1.x](https://www.virtualbox.org/)
* [Vagrant 2.0.x](https://www.vagrantup.com/)

Software versions other than the ones specified may work, but it is not
recommended to deviate from these requirements. Where a flexible version range
is provided (e.g. 1.0.x), consider using the lowest software version in said
range (e.g. 1.0.0) if you encounter issues with a newer software version.

## Getting Started

* Ensure that all of the development requirements are installed and
  operational. Consult the documentation provided by the publishers of these
  software for details on how to install and verify proper operation.
* If this repository is being hosted on a web service, clone it to a local
  directory using Git.
* From a CLI, run the command `vagrant up` in the root directory of this
  repository. This command will build a virtual machine that will run the
  application.
* Open a web browser and load the web address `localhost:8079` to confirm the
  software is operational.

User credentials are as follows:
* Superuser
  - Username: `superuser`
  - Password: `superuser`
* Administrator
  - Username: `administrator1`
  - Password: `administrator1`
* Manager
  - Username: `manager1`
  - Password: `manager1`
* Accountant
  - Username: `accountant1`
  - Password: `accountant1`

## How to Contribute

Legible Accounting is a web-based software product that uses a PostgreSQL
database, and serves data via a JSON API written in Python (using the Django
framework). The user interface and user interactions are written with native
web technologies and the ReactJS JavaScript library.

Source files are used within the VM to run the application; however, they may
be modified outside of the VM using the text editor or IDE of personal choice.
Familiarity with Python or native web technologies is strongly encouraged for
development.

### Contributing to Server Development

The virtual machine that runs Legible Accounting contains a fully isolated
environment for Apache, PostgreSQL, Python, and the Django framework. To enter
the virtual machine, run `vagrant ssh` from the root directory of this
repository.

Server developers rarely will need to do more than modifying source files or
running Python/Django management commands. For the latter, a helper script is
available. Run `./server/utils/shell.sh` from the root directory of this
repository to enter the virtual machine with the Python virtual environment
already sourced and the current working directory set to the location of the
project `manage.py` file.

### Contributing to Client Development

The virtual machine that runs Legible Accounting contains a fully isolated
NodeJS installation and all node modules depended on by the frontend code
e.g. React. To enter the virtual machine, run `vagrant ssh` from the root
directory of this repository.

Client developers will rarely need to do more than modifying source files or
interacting with the NPM package manager. For the latter, a helper script is
avaiable. Run `./client/utils/shell.sh` from the root directory of this
repository to enter the virtual machine with the current working directory set
to the location of the project `package.json` file.

To aid in client development, an alternate static file server is available for
use. Run the `./client/utils/shell.sh` script to enter the virtual machine, and
run `npm start` from the prompt. Then load the web address `localhost:8080` to
access the server. This alternate server supports immediate reloading of the
website when client source files are changed, and proxies all non-file
requests to the main API server.
