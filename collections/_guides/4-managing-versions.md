---
layout: page
title: Managing versions
excerpt: Learn more about the Tuist built-in version management and how you can leverage it to ensure reproducible environments.
---

When adding a dependency between your project and third-party tools, it's crucial that the dependency is reproducible. If the dependency is not the same across all the environments, it might produce different results with the same input. Have you ever heard the well-known *"it works for me"*? That's often the result of having non-reproducible environments.

If a tool is written in Ruby or Javascript, we can use dependency managers like [Bundler](https://bundler.io) and [NPM](https://www.npmjs.com), which support not only pining the version of the dependencies but executing the right version that your project is pinned to. For instance, if you run `bundle exec cocoapods`, Bundler makes sure that the version of CocoaPods that you are executing is the version that is specified in your `Gemfile`.

Although the [Swift Package Manager](https://swift.org/package-manager/) supports defining dependencies to be linked from your packages, it doesn't support defining tools your project depends on. In other words, there isn't a `swift exec tuist`. The closest option is [Mint](https://github.com/yonaskolb/mint), a non-official tool that aims to solve that problem. However, it means a dependency with another tool that should be installed in the environment, probably with [Homebrew](https://brew.sh), and whose versioning is out of our control. Besides introducing some inconvenience, it might result in a non-reproducible environment.

**Tuist opted for a simple, reproducible and transparent version management approach that is built into Tuist.** If you followed the [Getting Started](/guides/1-getting-started) guide when you installed Tuist, you installed a tool called `tuistenv` that got renamed into `tuist`. Try executing the following command:

{% window_highlight bash %}
tuist --help-env
{% endwindow_highlight %}

It'll execute help on `tuistenv` which prints the list of commands that are available to manage the Tuist environment. In the following sections, we'll go through each of these commands, explain what they do, and what they are for.

### tuist local
When executed with no arguments, `tuist local`, it prints the list of versions that are available locally:

{% window_highlight bash %}
$ tuist local

The following versions are available in the local environment:
- 0.4.0
{% endwindow_highlight %}

If you execute the same command passing a version as an argument, it pins the directory where you are running the command from to the given version:

{% window_highlight bash %}
$ tuist local 0.4.0 

Generating .tuist-version file with version 0.4.0
✅ Success: File generated at path /Tuist/.tuist-version
{% endwindow_highlight %}

Note that it pins the version by creating a `.tuist-version` file in the current directory.

### tuist bundle
You might want to bundle `tuist` in your repository so that each git snapshot contains all the necessary elements to interact with the projects in it. The `tuist bundle` command is precisely for that:

{% window_highlight bash %}
$ tuist bundle 0.4.0

Bundling the version 0.4.0 in the directory /Tuist/.tuist-bin
✅ Success: tuist bundled successfully at /Tuist/.tuist-bin
{% endwindow_highlight %}

It creates a `.tuist-bin` directory in the current directory that contains the `tuist` binary and its artifacts.

### tuist install
`tuist install` installs a given version locally. It requires a version or a commit sha to be passed:

{% window_highlight bash %}
$ tuist install 0.4.0

Downloading version from https://github.com/tuist/tuist/releases/download/0.4.0/tuist.zip
Installing...
Version 0.4.0 installed
{% endwindow_highlight %}

If the given version has a GitHub release, it'll pull the compiled assets and place them locally. Otherwise, it'll pull the source code, compile it, and move them into the right directory.

### tuist uninstall
As you might have guessed, this command reverts the command above by deleting an installed version:

{% window_highlight bash %}
$ tuist uninstall 0.4.0

✅ Success: Version 0.4.0 uninstalled
{% endwindow_highlight %}

### tuist update
If there isn't any version installed, or there's a new version that is not installed locally, the update command installs it:

{% window_highlight bash %}
$ tuist update

Checking for updates...
No local versions available. Installing the latest version 0.4.0
Downloading version from https://github.com/tuist/tuist/releases/download/0.4.0/tuist.zip
Installing...
Version 0.4.0 installed
{% endwindow_highlight %}

## Running tuist

As we mentioned earlier, Tuist version management works **transparently**. Any of the commands mentioned above are necessary to use Tuist.

When you run Tuist:
- It determines which version should be executed by using the following priority order:
  - Bundled version *(in current directory or parents)*
  - Pinned version *(in current directory or parents)*
  - Highest local version
- Once the version is determined, it checks if the version exists locally. If it doesn't, it installs it.
- After ensuring that the version exists, it runs it, passing the right arguments.

**Running tuist with a pinned version that is not installed**

{% window_highlight bash %}
$ tuist --help

Using version 0.4.0 defined at /Users/pedropinera/Downloads/.tuist-version
Version 0.4.0 not found locally. Installing...
Downloading version from https://github.com/tuist/tuist/releases/download/0.4.0/tuist.zip
Installing...
Version 0.4.0 installed
OVERVIEW: Generate, build and test your Xcode projects.

USAGE: tuist <command> <options>
...
{% endwindow_highlight %}

**Running tuist with a bundled version**
{% window_highlight bash %}
$ tuist --help

Using bundled version at path /Users/pedropinera/Downloads/.tuist-bin
OVERVIEW: Generate, build and test your Xcode projects.

USAGE: tuist <command> <options>
...
{% endwindow_highlight %}

**Running tuist without any pinned nor bundled version**
{% window_highlight bash %}
$ tuist --help

OVERVIEW: Generate, build and test your Xcode projects.

USAGE: tuist <command> <options>
...
{% endwindow_highlight %}
