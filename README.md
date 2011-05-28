JS/Canvas Experiments
=====================

A collection of JavaScript/Canvas rendering experiments put together randomly when I've felt so inclined.

Experiments
-----------

* Quad - This script recursively subdivides a given image until one of two conditions are met:
First, the given quadrant matches a specified color threshold. Second, the size of one of the demensions of the quadrant is smaller
than the minimum area. If the conditions are met, the quadrant is filled with the average color of its contents. Inspired by the
"American Pixel" project* (see quad/Quadrant.js or http://www.lemieuxster.com/dev/js/blockmaker/indexQuad.html)

* Block - Just traverses the image from the top left at a given block size and rerenders the block with the average color of its contents.
(see block/BlockMaker.js /coming soon/ or http://www.lemieuxster.com/dev/js/blockmaker/index.html)

*Created 2011 David LeMieux*

*I just looked at the project and asked myself how it was done; I then came up with the solution on my own. I have not read the
ajpeg compression algorithm nor do I know how it is implemented. Any similarity is coincidence.

