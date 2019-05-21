# this script is to use when a new LASTIG researcher creates  its webpage. It creates the webpage repository, with the gh-pages branch and then copies the template into the new repository.
#!/bin/bash
set -e # exit on error

USER="your-github-user-name"
PROJECT="your-name-webpage" # example: "gtouya-webpage" for Guillaume Touya
QUICKSTART="https://github.com/itownsResearch/itowns-quickstart.git"
ITOWNS="https://github.com/itownsResearch/itowns.git"
ORIGIN="https://$USER@github.com/$USER/$PROJECT.git"
BRANCH_QUICKSTART="master"
BRANCH_ITOWNS="master"

echo " # Create the project '$PROJECT' on github : $ORIGIN"
curl -u "$USER" https://api.github.com/user/repos -d "{\"name\":\"$PROJECT\"}"