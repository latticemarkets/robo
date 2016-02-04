/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 01/02/2016
*/

describe('Title Case filter', () => {
    'use strict';

    let $filter;

    beforeEach(() => {
        module('app');

        inject(_$filter_ => {
            $filter = _$filter_;
        });
    });

    it('should set each first letter uppercase', function () {
        const oneWord = "title";
        const twoWords = "long title";

        const resultOneWord = $filter('titlecase')(oneWord);
        const resultTwoWords = $filter('titlecase')(twoWords);

        expect(resultOneWord).toBe("Title");
        expect(resultTwoWords).toBe("Long Title");
    });

    it('should return nothing is title is empty', () => {
        const emptyTitle = "";

        const result = $filter('titlecase')(emptyTitle);

        expect(result).toBe("");
    });

    it('should ignore small common words', () => {
        const title = "a journey in hell";

        const result = $filter('titlecase')(title);

        expect(result).toBe("A Journey in Hell");
    });
});