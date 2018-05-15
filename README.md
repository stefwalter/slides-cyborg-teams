# Setup

    $ npm install

# PDF Conversion

    $ python -m SimpleHTTPServer &
    $ sudo docker run --rm --net=host -v `pwd`:/slides astefanutti/decktape --pause=5000 http://localhost:8000 slides-cyborg-teams.pdf
