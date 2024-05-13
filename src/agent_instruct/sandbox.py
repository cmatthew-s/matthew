
# List or queue or stack or tree
# Implement tree:
# put each test as each nodes (controller is creating the tree) --. root & nides
# 

# there will be two tree, tree's of problem and solution
# another control integrate the solution
# if there's another in tree solution problem put it back to the tree of problem,

# ---------------------------------------

# start from the middle, uploading the tree files 
# tester to run the test and runner to run the test runner
# controller is creating data structure

# save the results
# private first ( Free BSD, GNU GPL )

# ----------------------------------
# one for use case ()
# 

def find_sum_pairs(array, target):
    positions = []
    for i in range(len(array)):
        element = array[i]
        if element < target:
            positions.append(element)
        elif element > target:
            target -= element
        else:
            return [i, i-1]
    return positions


array = [1, 2, 3, 4, 5]
target = 7
positions = find_sum_pairs(array, target)
print(positions)

import unittest

class TestFindSumPairs(unittest.TestCase):
    def test_empty_array(self):
        self.assertEqual(find_sum_pairs([], 0), [])

    def test_one_element_array(self):
        self.assertEqual(find_sum_pairs([1], 0), [])

    def test_two_element_array(self):
        self.assertEqual(find_sum_pairs([1, 2], 0), [])

    def test_three_element_array(self):
        self.assertEqual(find_sum_pairs([1, 2, 3], 0), [])

    def test_four_element_array(self):
        self.assertEqual(find_sum_pairs([1, 2, 3, 4], 0), [])

    def test_five_element_array(self):
        self.assertEqual(find_sum_pairs([1, 2, 3, 4, 5], 0), [])

    def test_ten_element_array(self):
        self.assertEqual(find_sum_pairs([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0), [])

    def test_ten_element_array_target_sum_10(self):
        self.assertEqual(find_sum_pairs([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10), [0, 9])

    def test_ten_element_array_target_sum_15(self):
        self.assertEqual(find_sum_pairs([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 15), [0, 8])

    def test_ten_element_array_target_sum_20(self):
        self.assertEqual(find_sum_pairs([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 20), [0, 9])

if __name__ == '__main__':
    unittest.main(exit=False)