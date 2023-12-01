import { useCallback, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";

const CategoryFilter = ({ categories, allFilters, setAllFilters }) => {
  const categoryRefs = useRef([]);

  const clearCategories = useCallback(() => {
    categoryRefs.current.forEach((_, idx) => {
      categoryRefs.current[idx].checked = false;
    });
  }, []);

  useEffect(() => {
    if (allFilters.categories === "") {
      clearCategories();
    }
  }, [allFilters.categories, clearCategories]);

  const selectCategory = (e, category) => {
    const selectedMainCategory = category.name.split("/")[0];
    const allCategories = categoryRefs.current.map((_, id) => {
      return { name: categories[id].name, idx: id };
    });

    const indexesOfMainCategory = allCategories.reduce((acc, item) => {
      const category = item.name.split("/")[0];

      if (selectedMainCategory === category) {
        acc.push(item.idx);
      }

      return acc;
    }, []);

    if (e.target.checked) {
      categoryRefs.current.forEach((_, idx) => {
        if (!indexesOfMainCategory.includes(idx)) {
          categoryRefs.current[idx].checked = false;
        } else {
          categoryRefs.current[idx].checked = true;
        }
      });

      setAllFilters({
        ...allFilters,
        categories: selectedMainCategory,
      });
    } else {
      // setAllFilters({
      //   ...allFilters,
      //   categories: null,
      // });
      clearCategories();
    }
  };

  return (
    <Form>
      {categories &&
        categories?.map((category, idx) => (
          <div key={idx} className="mb-3">
            <Form.Check type="checkbox" id={`check-category-${idx}`}>
              <Form.Check.Input
                type="checkbox"
                isValid
                ref={(cat) => (categoryRefs.current[idx] = cat)}
                onChange={(e) => selectCategory(e, category)}
              />
              <Form.Check.Label style={{ cursor: "pointer" }}>
                {category.name}
              </Form.Check.Label>
            </Form.Check>
          </div>
        ))}
    </Form>
  );
};

export default CategoryFilter;
