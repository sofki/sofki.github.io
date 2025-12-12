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

Working with metal-containing proteins is often very complicated, especially when no standard focefields are available for treating this specific type of metal and most importantly, the protein residues that are bonded to it. Luckily, a group of researchers form Italy published a modified AMBER forcefield that was optimized specifically for Zn proteins, [first](https://pubs.acs.org/doi/10.1021/acs.jcim.9b00407?ref=recommended) treating HIS and CYS zinc-binding residues and [then](https://pubs.acs.org/doi/10.1021/acsomega.0c01337?ref=recommended) extending it also for ASP and GLU.

In this work we will use the work of [Marina Macchiagodena](https://orcid.org/0000-0002-3151-718X) _et al._ in order to prepare a system for MD simulation, containing Zn and a ligand. They have also worked on cadmium-containing proteins, more details you can find [here](https://onlinelibrary.wiley.com/doi/10.1002/jcc.70154).

So, what you need to do first is to download the gromacs parameter files from the supporting info of the two papers concerning Zn mentioned above. If you decompress the .zip files, you will see a list like that below:

<p align="center">
  <img src="https://sofki.github.io//assets/img/zip.png" alt="Centered image" width="200"/>
</p>

If you open the README file you will be directed to the corresponding gromacs [page](https://manual.gromacs.org/current/how-to/topology.html) that explains how to add an external residue to a local copy of a forcefield. We will take this process step by step.

1. First, you will need to create a local copy of an amber forcefield, copying it from your gromacs directory to your working folder.
    <div style="background-color: #f8f9fa; border-left: 4px solid #d73a49; padding: 12px; margin: 16px 0; border-radius: 4px;">
      <strong style="color: #d73a49;">⚠️ Attention:</strong> If you work on an HPC, it is better to do these manipulations with a conda version of gromacs. This is suggested because although you will be able to copy the forcefield folder from where it is loaded in the HPC system to your working directory, the residuetypes.dat will be read from where all the forcefields reside, and most probably, you won't be able to change it in your HPC system. However, if you create a conda environment with gromacs installed, you may directly change this file. This step is crucial for adding new bonded residue types.
    </div>
  The forcefields should be located somewhere in the ``share`` (or ``lib`` or ``bin``) folder of the conda environment that you used. In order to easily find it do:
  ```
    echo "$CONDA_PREFIX"
  ```
  and the location of your conda environment will be printed. Go there with ``cd`` and then search for the ``gromacs/top`` directory, most probably inside the ``share`` folder of your environment.

2. Then, you simply need to copy the contents of each file listed in the picture above to the relevant file in your local copy of the amber forcefield. For example, you will copy this from the ``ffnonbonded.itp`` of the .zip file you downloaded and copy it to the end of the ``ffnonbonded.itp`` of your local amber forcefield. My suggestion is to delete the Zn entry, since it already exists in your amber forcefield and it might trigger a warning.
   <p align="center">
       <img src="https://sofki.github.io//assets/img/ffnonbonded.png" alt="Centered image" width="400"/>
   </p>
   
3. In the ``aminoacids.rtp`` ignore the first part illustrated in the picture below, since it already exists in your local copy and multiple entries might cause errors.
   <p align="center">
       <img src="https://sofki.github.io//assets/img/aminortp.png" alt="Centered image" width="400"/>
   </p>
   
4. Do the same for the rest of the files (``ffnonbonded.itp, ffbonded.itp, atomtypes.atp, aminoacids.rtp, aminoacids.hdb``). For the ``residuetypes.dat`` you will have to change the file in your gromacs ``top`` directory (it doesn't work with a local copy).

5. After finishing the first AMBER forcefield upgrade, containing parameters for HIS and CYS, do the same procedure with the second one, containing parameters for ASP and GLU. 

6. Now it's time to process your pdb file in order to make it work with ``pdb2gmx``. First you must investigate your file with a pdb viewer (I am using the open source version of [Pymol](https://anaconda.org/channels/conda-forge/packages/pymol-open-source/overview) ) and check which residues are bound to Zn. Take notice of the numbers of the relevant CYS, HIS, ASP and GLU.

7. Next, open your pdb with a text editor and change those residues accordingly: rename CYS to CYZ, HIS to HDZ or HEZ, depending on its protonation (HDZ for HID and HEZ for HIE), GLU to GLZ and ASP to ASZ. Select the oxygen interacting with the zinc ion and rename it to OZ.

8. After changing the interacting residues accordingly, locate the Zn ions in your pdb file. Make sure that their residue is plain ZN and not ZNXX (in my case it was named ZN10 and I got an error for uknown residue).

9. Another issue I encountered, is that if your ZN residues are randomly placed inside your pdb, gromacs fails during the ``pdb2gmx`` process with the following error:
    ```
    Fatal error:
The residues in the chain GLU1--VAL439 do not have a consistent type. The
first residue has type 'Protein', while residue ZN1 is of type 'Ion'. Either
there is a mistake in your chain, or it includes nonstandard residue names
that have not yet been added to the residuetypes.dat file in the GROMACS
library directory. If there are other molecules such as ligands, they should
not have the same chain ID as the adjacent protein chain since it's a separate
molecule.

    ```

10. A way to bypass this problem is by reordering your pdb file. In my case. I also had a ligand (resname UNK), so I decided to put all the ZN ions in the end of the protein just before the ligand. To do so, execute the following commands. 
```
grep 'Zn' system.pdb > Zn.pdb && grep -v 'Zn' system.pdb > system_no_Zn.tmp && mv system_no_Zn.tmp system.pdb
```
in order to remove the ZN ions from your system file and write two seperate files; one containing everything except Zn (named again ``system.pdb``) and one with only the Zn ions (named ``Zn.pdb``)

11. Then we will write a new .pdb file by placing the Zn ions exactly **before** our ligand.
```
awk '/PATTERN/ && !done { system("cat Zn.pdb"); done=1 } { print }' system.pdb > systemZn.pdb
```
replace _PATTERN_ with what is appropriate for your case. In my case it was "HETATM 7013  C   UNK", i.e., the first atom of my ligand. You may also do this by hand, by opening the system.pdb file and pasting the ZN residues in an appropriate place (preferably, right after the terminal residue of your protein).

12. The last step is to reorder and renumber the pdb file, because after all these text modifications the numbering will not be correct. The [openbabel](https://pypi.org/project/openbabel/) package is needed in order to reorder and renumber the file.
```
obabel -ipdb systemZn.pdb -opdb -O final.pdb
```

13. Now open your final.pdb and make sure that the ZN residues belong to a different chain from that of your protein. If not, change the Zn chain from e.g. A to B.

14. Now you are ready to build your topology with:
```
gmx pdb2gmx -f final.pdb -ter -ignh 
```
  When prompted, choose your local copy of the forcefield (normally the option 1)




  
