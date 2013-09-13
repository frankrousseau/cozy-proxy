fs = require 'fs'

# Grab test files 
walk = (dir, fileList) ->
    list = fs.readdirSync(dir)
    if list
        for file in list
            if file
                filename = dir + '/' + file
                stat = fs.statSync(filename)
                if stat and stat.isDirectory()
                    walk(filename, fileList)
                else if filename.substr(-6) == "coffee"
                    fileList.push(filename)
    fileList

{exec} = require 'child_process'
testFiles = walk("test", [])

task 'tests', 'run tests through mocha', ->
        runTests testFiles
        
runTests = (fileList) ->
    console.log "Run tests with Mocha for " + fileList.join(" ")
    command = "mocha " + fileList.join(" ") + " --reporter spec "
    command += "--require should --compilers coffee:coffee-script --colors"
    exec command, (err, stdout, stderr) ->
        console.log stdout
        if err
            console.log "Running mocha caught exception: \n" + err
            process.exit 1
        else
            process.exit 0

option '-f', '--file [FILE]', 'test file to run'

task 'tests:file', 'run test through mocha for a given file', (options) ->
    file = options.file
    console.log "Run tests with Mocha for " + file
    command = "mocha " + file + " --reporter spec "
    command += "--require should --compilers coffee:coffee-script --colors"
    exec command, (err, stdout, stderr) ->
        if err
            console.log "Running mocha caught exception: \n" + err
        console.log stdout

task "convert", "Convert code to JS", ->
    command = "coffee -cb *.coffee lib/*.coffee"
    exec command, (err, stdout, stderr) ->
        if err
            console.log "Conversion to JS failed.\n" + err
        else
            console.log "Conversion to JS succeeded."


task "lint", "Run coffeelint on proxy files", ->
        process.env.TZ = "Europe/Paris"
        command = "coffeelint "
        command += "    -f coffeelint.json -r ./*.coffee lib/ test/"
        exec command, (err, stdout, stderr) ->
                console.log err
                console.log stdout
