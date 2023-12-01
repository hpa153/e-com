import { Form } from "react-bootstrap";

const AttributesFilter = ({ attrFilter, setSelectedAttrs }) => {
  return (
    <>
      {attrFilter &&
        attrFilter.length > 0 &&
        attrFilter?.map((filter, idx) => (
          <div key={idx} className="mb-3">
            <Form.Label>
              <b>{filter.key}</b>
            </Form.Label>
            {filter.value.map((filterVal, idx) => (
              <Form.Check
                key={idx}
                type="checkbox"
                label={filterVal}
                onChange={(e) => {
                  setSelectedAttrs((prevFilters) => {
                    if (prevFilters.length === 0) {
                      return [{ key: filter.key, value: [filterVal] }];
                    }

                    const keyIndex = prevFilters.findIndex(
                      (item) => item.key === filter.key
                    );

                    if (keyIndex === -1) {
                      return [
                        ...prevFilters,
                        { key: filter.key, value: [filterVal] },
                      ];
                    }

                    if (e.target.checked) {
                      prevFilters[keyIndex].value.push(filterVal);
                      const uniqueVals = [
                        ...new Set(prevFilters[keyIndex].value),
                      ];
                      prevFilters[keyIndex].value = uniqueVals;
                      return [...prevFilters];
                    }

                    const uncheckedValue = prevFilters[keyIndex].value.filter(
                      (val) => val !== filterVal
                    );
                    prevFilters[keyIndex].value = uncheckedValue;

                    if (uncheckedValue.length > 0) {
                      return [...prevFilters];
                    } else {
                      const filteredAttrs = prevFilters.filter(
                        (item) => item.key !== filter.key
                      );
                      return [...filteredAttrs];
                    }
                  });
                }}
              />
            ))}
          </div>
        ))}
    </>
  );
};

export default AttributesFilter;
