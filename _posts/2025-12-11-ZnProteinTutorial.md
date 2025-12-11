---
layout: post
title: Zn-Metalloprotein with modified AMBER forcefield tutorial
subtitle: A GROMACS tutorial for MD simulations of Zn-containing metalloprotein 
cover-img: 
thumbnail-img: https://sofki.github.io//assets/img/gmx.png
share-img: https://sofki.github.io//assets/img/gmx.png
tags: [tutorials, GROMACS, MD, AMBER forcefield]
author: Sofia Kiriakidi
---

Working with metal-containing proteins is often very complicated, especially when no standard focefields are available for treating this specific type of metal and most importantly, the protein residues that are bonded to it. Luckily, a group of researchers form Italy published a modified AMBER forcefield that was optimized specifically for Zn proteins, [first](https://pubs.acs.org/doi/10.1021/acs.jcim.9b00407?ref=recommended) treating HIS and CYS zinc-binding residues and [then](https://pubs.acs.org/doi/10.1021/acsomega.0c01337?ref=recommended) extending it also for ASp and GLU.

In this work we will use the work of [Marina Macchiagodena](https://orcid.org/0000-0002-3151-718X) _et al._ in order to prepare a system for MD simulation, containing Zn and a ligand. They have also worked on cadmium-containing proteins, more details you can find [here](https://onlinelibrary.wiley.com/doi/10.1002/jcc.70154).

So, what you need to do first is to download the gromacs parameter files from the supporting info of the two papers concerning Zn mentioned above. If you decompress the .zip file, you will se a list like that below:

<p align="center">
  <img src="https://sofki.github.io//assets/img/zip.png" alt="Centered image" width="200"/>
</p>

If you open the README file you will be directed to the corresponding gromacs [page](https://manual.gromacs.org/current/how-to/topology.html) that explains how to add an external residue to a local copy of a forcefield. We will take this process step by step.

1. First, you will need to create a local copy of an amber forcefield, copying it from your gromacs directory to your working folder.
  > [!CAUTION]
  > If you work on an HPC, it is better to do this manipulations with a conda version of gromacs. This is suggested because although you will be able to copy the forcefield folder from where it is loaded in the HPC system to your working directory, the residuetypes.dat will be read from where all the forcefields reside, and most probably, you won't be able to change it in your HPC system. However, if you create a conda environment with gromacs installed, you may directly change this file. This step is crucial for adding new residue types.

2. 
