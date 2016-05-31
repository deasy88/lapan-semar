# -*- coding: utf-8 -*-
## HDF5 to JSON converter
## Author - Janu Verma
## j.verma5@gmail.com

##############################################################################################
import json
import sys
from collections import defaultdict
import re
import io

try:
	import numpy
except:
	print "Error : Requires numpy"
	sys.exit()

try:
	from tables import *
except:
	print "Error : Requires PyTables"
	


h5file = open_file('o3.he5')

##########################################################################################




class converter:
	"""
	Converts the contents of an HDF5 file into JSON. 
	Also has methods to access the contents of a group directly
	without following the hierarchy. 
	"""
	def __init__(self, input_file):
		self.file_name = re.sub(r'\.h5$', '','o3.he5')
		self.groupParentDict = defaultdict(list)
		self.groupContentsDict = {}
		self.file = input_file
		self.allGroups = []
		for group in input_file.walk_groups():
			name = group._v_name
			parent = group._v_parent
			parent = parent._v_name
			temp1 = self.allGroups.append(name)
			temp2 = self.groupParentDict[parent].append(name)
			temp3 = self.groupContentsDict[name] = {}
			temp4 = self.allGroups

			# for array in h5file.list_nodes(group, classname="Array"):
			# 	array_name = array._v_name
			# 	array_contents = array.read()
			# 	array_info = {array_name : array_contents}
			# 	self.groupContentsDict[name].update(array_info)

			for gp in h5file.list_nodes(group, classname="Group"):
				gp_name = gp._v_name
				gp_parent_name = gp._v_parent._v_name
				try:

					gp_contents = {gp_name : self.groupContentsDict[gp_name]}
				except:
					gp_contents = {gp_name :{}}
				self.groupContentsDict[gp_parent_name].update(gp_contents)
				temp1 = self.groupContentsDict


			# for table in h5file.list_nodes(group, classname="Table"):
			# 	table_name = table._v_name
			# 	table_contents = table.read()
			# 	table_info = {table_name : table_contents}
			# 	self.groupContentsDict[name].update(table_info)

	def jsonOutput(self):
		"""
		Returns a JSON document containing all the information stored in the HDF5 file.
		Creates a JSON file of the same name as the input HDF5 file with json extension.
		When decoded the file contains a nested dictionary. 
		The primary key is the root group '\'. 
		"""
		alpha = self.groupContentsDict

		json_file_name = self.file_name + '.json' 
		with io.open(json_file_name, 'w', encoding='utf-8') as f:
			#record = json.dumps(alpha,cls=NumpyAwareJSONEncoder)
			f.write(unicode(json.dumps(alpha, cls=NumpyAwareJSONEncoder, ensure_ascii=False)))
		f.close()
		return 

	def Groups(self):
		"""
		Returns all the groups in the HDF5 file. 
		Helpful in exploring the file and getting an idea of the contents. 
		"""	
		return json.dumps(self.allGroups, cls=NumpyAwareJSONEncoder)

	def subgroups(self, group):
		"""
		Returns the subgroups of the group.  
		"""	
		return json.dumps(self.groupParentDict[group], cls=NumpyAwareJSONEncoder)

	def groupContents(self, group):
		"""
		Returns the contents of a groups. 
		You can access the contents of the group directly
		without following the hierarchy. 
		""" 	
		info = self.groupContentsDict[group]
		return json.dumps(info, cls=NumpyAwareJSONEncoder)



########################################################################################################

class NumpyAwareJSONEncoder(json.JSONEncoder):
	"""
	This class facilitates the JSON encoding of Numpy onjects. 
	e.g. numpy arrays are not supported by the standard json encoder - dumps. 
	"""
	def default(self, obj):
		if isinstance(obj, numpy.ndarray):
			return obj.tolist()
		return json.JSONEncoder.default(self, obj)


#######################################################################################################

json_data = converter(h5file)
contents = json_data.jsonOutput() 






