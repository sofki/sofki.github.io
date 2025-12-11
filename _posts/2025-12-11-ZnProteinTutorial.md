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

Working with metal-containing proteins is often very complicated, especially when no standrad focefields are available for treating this specific type of metal and most importantly, the protein residues that are bonded to it. Luckily, a group of researchers form Italy published a modified AMBER forcefield that was optimized specifically for Zn proteins, [first](10.1021/ACS.JCIM.9B00407) treating HIS and CYS zinc-binding residues and [then](https://pubs.acs.org/doi/10.1021/acsomega.0c01337?ref=recommended) extending it also for ASp and GLU.

In this work we will use the work of [Marina Macchiagodena](https://orcid.org/0000-0002-3151-718X) _et al._ in order to prepare a system for MD simulation, containing Zn and a ligand. They have also worked on cadmium-containing proteins, more details you can find [here](https://onlinelibrary.wiley.com/doi/10.1002/jcc.70154).

So, what you need to do first is to download the gromacs parameter files from the supporting info of the two papers concerning Zn mentioned above.
