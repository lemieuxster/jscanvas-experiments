JS/Canvas Experiments
=====================

A collection of JavaScript/Canvas rendering experiments put together randomly when I've felt so inclined.

Experiments
-----------

* Quad - Inspired by the "American Pixel" project, this script recursively subdivides a given image until one of two conditions are met:
First, the given quadrant matches a specified color threshold. Second, the size of one of the demensions of the quadrant is smaller
than the minimum area. If the conditions are met, the quadrant is filled with the average color of its contents. (see quad/Quadrant.js)

* Block - Just traverses the image from the top left at a given block size and rerenders the block with the average color of its contents.
(see block/BlockMaker.js /coming soon/)

*Copyright 2011 David LeMieux*